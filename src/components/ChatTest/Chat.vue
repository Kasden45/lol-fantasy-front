<template>
    <div class="chat">
      <div class="messages">
        <div v-for="(message, index) in messages" :key="index" class="message">
          {{ message }}
        </div>
      </div>
      <input class="chat-input" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message...">
    </div>
  </template>
  
  <script>
  import socket from '@/socket.js';
  
  export default {
    data() {
      return {
        messages: [],
        newMessage: ''
      };
    },
    created() {
      socket.on('message', ({clientId, message}) => {
        this.messages.push(`${clientId}: ${message}`);
      });
    },
    methods: {
      sendMessage() {
        var userId = this.$store.getters.getProfileId;
        if (this.newMessage.trim() !== '') {
          var m = this.newMessage;
          socket.emit('message', {clientId: userId, message:m});
          this.newMessage = '';
        }
      }
    }
  };
  </script>
  
  <style>
  .chat {
    display: flex;
    flex-direction: column;
    height: 20vh;
  }
  .messages {
    flex: 1;
    overflow-y: auto;
  }
  .message {
    padding: 2px;
    border-bottom: 1px solid #ccc;
  }
  .chat-input {
    padding: 10px;
    border: 1px solid #ccc;
    width: 100%;
    box-sizing: border-box;
  }
  </style>