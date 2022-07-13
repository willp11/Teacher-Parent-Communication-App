import json
from channels.generic.websocket import AsyncWebsocketConsumer
from rest_framework.authtoken.models import Token
from asgiref.sync import sync_to_async
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

# consumer for the group chat
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