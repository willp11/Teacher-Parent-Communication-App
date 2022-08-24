from email.headerregistry import Group
import json
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from rest_framework.authtoken.models import Token
from asgiref.sync import sync_to_async, async_to_sync
from .models import Message, ChatGroup, GroupMember
from .tasks import send_app_notifications

@sync_to_async
def get_user(token):
    return Token.objects.get(key=token).user

@sync_to_async
def save_message(chat_id, sender, message):
    group = ChatGroup.objects.get(pk=chat_id)
    sender_instance = GroupMember.objects.get(user=sender, group=group)
    message = Message.objects.create(sender=sender_instance, group=group, content=message)
    message.save()
    send_app_notifications(sender, 'Message', group)
    return message

# type = chat or call, value = True or False
@sync_to_async
def update_connected_status(chat_id, user, type, value):
    print("updating connected status...")
    if value != True and value != False:
        raise ValueError
    group = ChatGroup.objects.get(pk=chat_id)
    group_member = GroupMember.objects.get(user=user, group=group)
    if type == 'chat':
        group_member.connected_to_chat = value
        group_member.save()
        print(group_member, group_member.connected_to_chat)
    elif type == 'call':
        group_member.connected_to_call = value
        group_member.save()
        print(group_member, group_member.connected_to_call)
    else:
        raise ValueError

@sync_to_async
def get_other_user(chat_id, user):
    group = ChatGroup.objects.get(pk=chat_id)
    group_members = GroupMember.objects.filter(group=group)
    for member in group_members:
        if member.user.id != user.id:
            return member
    return None

# Group chat
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        token = self.scope['url_route']['kwargs']['token']
        try:
            user = await get_user(token)
            self.user = user
            self.room_name = self.scope['url_route']['kwargs']['room_name']
            self.room_group_name = 'chat_%s' % (self.room_name)

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

            await update_connected_status(self.room_name, self.user, 'chat', True)
        except:
            print("error connecting to websocket")

    async def disconnect(self, close_code):
        try:
            await update_connected_status(self.room_name, self.user, 'chat', False)

            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        except:
            print("error disconnecting from websocket")

    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']

            message_instance = await save_message(self.room_name, self.user, message)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'id': message_instance.id,
                    'message': message,
                    'user': {'id': self.user.id, 'first_name': self.user.first_name, 'last_name': self.user.last_name}
                }
            )
        except:
            print("error receiving message")

    async def chat_message(self, event):
        message = event['message']
        user = event['user']
        id = event['id']

        await self.send(text_data=json.dumps({
            'id': id,
            'message': message,
            'user': user
        }))

# Video Chat
class CallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        token = self.scope['url_route']['kwargs']['token']
        try:
            user = await get_user(token)
            self.user = user
            self.chat_id = self.scope['url_route']['kwargs']['chat_id']
            self.room = 'chat_%s_%s' % (self.user.id, self.chat_id)

            await self.channel_layer.group_add(
                self.room,
                self.channel_name
            )

            await self.accept()

            await update_connected_status(self.chat_id, self.user, 'call', True)

            other_user = await get_other_user(self.chat_id, self.user)

            self.other_user = other_user
            self.other_room = 'chat_%s_%s' % (self.other_user.user.id, self.chat_id)

            # response to client that we are connected.
            await self.send(text_data=json.dumps({
                'type': 'connection',
                'data': {
                    'message': "Connected",
                    'other_user_connected': other_user.connected_to_call
                }
            }))

            # response to other user, that we are connected
            await self.channel_layer.group_send(
                self.other_room,
                {
                    'type': 'user_connected',
                    'data': {
                        'user': self.user.id,
                    }
                }
            )
        except:
            print("Failed to connect to websocket")

    async def disconnect(self, close_code):
        try:
            # notify the other user that you have disconnected
            await self.channel_layer.group_send(
                self.other_room,
                {
                    'type': 'user_disconnected',
                    'data': {
                        'user': self.user.id,
                    }
                }
            )

            # update connected status in database
            await update_connected_status(self.chat_id, self.user, 'call', False)

            # Leave room group
            await self.channel_layer.group_discard(
                self.room,
                self.channel_name
            )
        except:
            print("Error disconnecting from websocket")

    # Receive message from client WebSocket
    async def receive(self, text_data):

        try:
            text_data_json = json.loads(text_data)
            eventType = text_data_json['type']
            
            # notify the callee we send a call_received event to their group
            if eventType == 'call':
                await self.channel_layer.group_send(
                    self.other_room,
                    {
                        'type': 'call_received',
                        'data': {
                            'caller': self.user.id,
                            'rtcMessage': text_data_json['data']['rtcMessage']
                        }
                    }
                )

            # notify other user that the call is cancelled
            if eventType == 'cancel_call':
                await self.channel_layer.group_send(
                    self.other_room,
                    {
                        'type': 'call_cancelled',
                        'data': {
                            'user': self.user.id,
                        }
                    }
                )

            # notify other user that the call is answered
            if eventType == 'answer_call':
                await self.channel_layer.group_send(
                    self.other_room,
                    {
                        'type': 'call_answered',
                        'data': {
                            'rtcMessage': text_data_json['data']['rtcMessage']
                        }
                    }
                )

            if eventType == 'ICEcandidate':
                # send ICE candidates to other user

                await self.channel_layer.group_send(
                    self.other_room,
                    {
                        'type': 'ICEcandidate',
                        'data': {
                            'rtcMessage': text_data_json['data']['rtcMessage']
                        }
                    }
                )
        except:
            print("error receiving message from client")

    async def call_received(self, event):
        await self.send(text_data=json.dumps({
            'type': 'call_received',
            'data': event['data']
        }))


    async def call_answered(self, event):
        await self.send(text_data=json.dumps({
            'type': 'call_answered',
            'data': event['data']
        }))


    async def ICEcandidate(self, event):
        await self.send(text_data=json.dumps({
            'type': 'ICEcandidate',
            'data': event['data']
        }))

    async def call_cancelled(self, event):
        await self.send(text_data=json.dumps({
            'type': 'call_cancelled',
            'data': event['data']
        }))

    async def user_connected(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_connected',
            'data': event['data']
        }))

    async def user_disconnected(self, event):
        await self.send(text_data=json.dumps({
            'type': 'user_disconnected',
            'data': event['data']
        }))