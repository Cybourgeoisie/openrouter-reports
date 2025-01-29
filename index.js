const { callChat: chatCallTools } = require('./tools/chat');
const { callStream: streamCallTools } = require('./tools/stream');
const { callChat: chatCallUnavailable } = require('./unavailable/chat');
const { callStream: streamCallUnavailable } = require('./unavailable/stream');
const { callChat: chatCallMessagesMultiUser } = require('./messages-multi-user/chat');
const { callStream: streamCallMessagesMultiUser } = require('./messages-multi-user/stream');
const { callChat: chatCallMessagesMultiUserContent } = require('./messages-multi-user-content/chat');
const { callStream: streamCallMessagesMultiUserContent } = require('./messages-multi-user-content/stream');
const { callChat: chatCallReasoningWithTools } = require('./reasoning-with-tools/chat');
const { callStream: streamCallReasoningWithTools } = require('./reasoning-with-tools/stream');

function printUsage() {
  console.log('Usage: node index.js <test-type> <mode>');
  console.log('  test-type: "tools", "unavailable", "messages-multi-user", "messages-multi-user-content", or "reasoning-with-tools"');
  console.log('  mode: "chat" or "stream"');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 2) {
    printUsage();
    process.exit(1);
  }

  const testType = args[0].toLowerCase();
  const mode = args[1].toLowerCase();

  if (testType !== 'tools' && testType !== 'unavailable' && testType !== 'messages-multi-user' && 
      testType !== 'messages-multi-user-content' && testType !== 'reasoning-with-tools') {
    console.error('Invalid test type. Use "tools", "unavailable", "messages-multi-user", "messages-multi-user-content", or "reasoning-with-tools".');
    printUsage();
    process.exit(1);
  }

  switch (mode) {
    case 'chat':
      if (testType === 'tools') {
        console.log('Tools test - Chat mode');
        await chatCallTools();
      } else if (testType === 'unavailable') {
        console.log('Unavailable test - Chat mode');
        await chatCallUnavailable();
      } else if (testType === 'messages-multi-user') {
        console.log('Messages multi-user test - Chat mode');
        await chatCallMessagesMultiUser();
      } else if (testType === 'messages-multi-user-content') {
        console.log('Messages multi-user content test - Chat mode');
        await chatCallMessagesMultiUserContent();
      } else if (testType === 'reasoning-with-tools') {
        console.log('Reasoning with tools test - Chat mode');
        await chatCallReasoningWithTools();
      }
      break;
    case 'stream':
      if (testType === 'tools') {
        console.log('Tools test - Stream mode');
        await streamCallTools();
      } else if (testType === 'unavailable') {
        console.log('Unavailable test - Stream mode');
        await streamCallUnavailable();
      } else if (testType === 'messages-multi-user') {
        console.log('Messages multi-user test - Stream mode');
        await streamCallMessagesMultiUser();
      } else if (testType === 'messages-multi-user-content') {
        console.log('Messages multi-user content test - Stream mode');
        await streamCallMessagesMultiUserContent();
      } else if (testType === 'reasoning-with-tools') {
        console.log('Reasoning with tools test - Stream mode');
        await streamCallReasoningWithTools();
      }
      break;
    default:
      console.error('Invalid mode. Use "chat" or "stream".');
      printUsage();
      process.exit(1);
  }
}

main().catch(error => {
  console.error('An error occurred:', error);
  process.exit(1);
});