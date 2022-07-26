from email.headerregistry import Group
import json
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from rest_framework.authtoken.models import Token
from asgiref.sync import sync_to_async, async_to_sync
from .models import Message, ChatGroup, GroupMember

@sync_to_async
def get_user(token):
    return Token.objects.get(key=token).user

@sync_to_async
def save_message(chat_id, sender, message):
    group = ChatGroup.objects.get(pk=chat_id)
    sender_instance = GroupMember.objects.get(user=sender, group=group)
    message = Message.objects.create(sender=sender_instance, group=group, content=message)
    message.save()
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
            self.my_name = 'chat%s' % (user.id)
            self.other_user = None
            self.room_name = self.scope['url_route']['kwargs']['room_name']

            await self.channel_layer.group_add(
                self.my_name,
                self.channel_name
            )

            await self.accept()

            await update_connected_status(self.room_name, self.user, 'call', True)

            # response to client, that we are connected.
            await self.send(text_data=json.dumps({
                'type': 'connection',
                'data': {
                    'message': "Connected"
                }
            }))
        except:
            print("Failed to connect to websocket")

    async def disconnect(self, close_code):
        try:
            # notify the other user that they have disconnected
            if self.other_user != None:
                await self.channel_layer.group_send(
                    self.other_user,
                    {
                        'type': 'call_cancelled',
                        'data': {
                            'user': self.my_name,
                        }
                    }
                )

            # update connected status in database
            await update_connected_status(self.room_name, self.user, 'call', False)

            # Leave room group
            await self.channel_layer.group_discard(
                self.my_name,
                self.channel_name
            )
        except:
            print("Error disconnecting from websocket")

    # Receive message from client WebSocket
    async def receive(self, text_data):

        try:
            text_data_json = json.loads(text_data)
            eventType = text_data_json['type']
            
            if eventType == 'call':
                name = text_data_json['data']['name']

                room_name = 'chat%s' % (name)
                self.other_user = room_name

                print(self.my_name, "is calling", room_name)

                # to notify the callee we send a call_received event to their group room_name
                await self.channel_layer.group_send(
                    room_name,
                    {
                        'type': 'call_received',
                        'data': {
                            'caller': self.my_name,
                            'rtcMessage': text_data_json['data']['rtcMessage']
                        }
                    }
                )

            # notify other user that the call is cancelled
            if eventType == 'cancel_call':
                if self.other_user != None:
                    await self.channel_layer.group_send(
                        self.other_user,
                        {
                            'type': 'call_cancelled',
                            'data': {
                                'user': self.my_name,
                            }
                        }
                    )

            if eventType == 'answer_call':
                # has received call from someone now notify the calling user
                # we can notify to the group with the caller name
                
                caller = text_data_json['data']['caller']
                room_name = 'chat%s' % (caller)
                self.other_user = room_name

                print(self.my_name, "is answering", caller, "call.")

                await self.channel_layer.group_send(
                    room_name,
                    {
                        'type': 'call_answered',
                        'data': {
                            'rtcMessage': text_data_json['data']['rtcMessage']
                        }
                    }
                )

            if eventType == 'ICEcandidate':
                # send ICE candidates to other user
                user = text_data_json['data']['user']

                room_name = 'chat%s' % (user)

                await self.channel_layer.group_send(
                    room_name,
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

        print('Call received by ', self.my_name )
        await self.send(text_data=json.dumps({
            'type': 'call_received',
            'data': event['data']
        }))


    async def call_answered(self, event):

        print(self.my_name, "'s call answered")
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