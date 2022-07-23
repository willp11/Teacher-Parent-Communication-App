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

# GROUP CHAT CONSUMER
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        token = self.scope['url_route']['kwargs']['token']
        try:
            user = await get_user(token)
            self.user = user
            self.room_name = self.scope['url_route']['kwargs']['room_name']
            self.room_group_name = 'chat_%s' % (self.room_name)

            print(self.room_group_name)

            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()
        except:
            print("error connecting to websocket")

    async def disconnect(self, close_code):
        try:
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

# VIDEO CHAT CONSUMER
class CallConsumer(WebsocketConsumer):
    def connect(self):
        token = self.scope['url_route']['kwargs']['token']
        try:
            user = Token.objects.get(key=token).user
            self.user = user
            self.my_name = 'chat_%s' % (self.user.id)

            print(user.id)

            async_to_sync(self.channel_layer.group_add)(
                self.my_name,
                self.channel_name
            )

            self.accept()

            # response to client, that we are connected.
            self.send(text_data=json.dumps({
                'type': 'connection',
                'data': {
                    'message': "Connected"
                }
            }))
        except:
            print("Failed to connect to websocket")

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.my_name,
            self.channel_name
        )

    # Receive message from client WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        # print(text_data_json)

        eventType = text_data_json['type']
        
        if eventType == 'call':
            name = text_data_json['data']['name']
            room_name = 'chat_%s' % (name)
            print(self.my_name, "is calling", room_name)

            # to notify the callee we send an event to the group name
            # and their group name is the name
            async_to_sync(self.channel_layer.group_send)(
                room_name,
                {
                    'type': 'call_received',
                    'data': {
                        'caller': self.my_name,
                        'rtcMessage': text_data_json['data']['rtcMessage']
                    }
                }
            )

        if eventType == 'answer_call':
            # has received call from someone now notify the calling user
            # we can notify to the group with the caller name
            
            caller = text_data_json['data']['caller']
            # print(self.my_name, "is answering", caller, "calls.")

            async_to_sync(self.channel_layer.group_send)(
                caller,
                {
                    'type': 'call_answered',
                    'data': {
                        'rtcMessage': text_data_json['data']['rtcMessage']
                    }
                }
            )

        if eventType == 'ICEcandidate':

            user = text_data_json['data']['user']

            async_to_sync(self.channel_layer.group_send)(
                user,
                {
                    'type': 'ICEcandidate',
                    'data': {
                        'rtcMessage': text_data_json['data']['rtcMessage']
                    }
                }
            )

    def call_received(self, event):

        # print(event)
        print('Call received by ', self.my_name )
        self.send(text_data=json.dumps({
            'type': 'call_received',
            'data': event['data']
        }))


    def call_answered(self, event):

        # print(event)
        print(self.my_name, "'s call answered")
        self.send(text_data=json.dumps({
            'type': 'call_answered',
            'data': event['data']
        }))


    def ICEcandidate(self, event):
        self.send(text_data=json.dumps({
            'type': 'ICEcandidate',
            'data': event['data']
        }))