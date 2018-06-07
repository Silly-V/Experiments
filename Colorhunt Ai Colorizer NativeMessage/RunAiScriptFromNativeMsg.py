#!/usr/bin/env python

import os, subprocess, sys, struct

def getMessage():
  rawLength = sys.stdin.read(4)
  if len(rawLength) == 0:
    sys.exit(0)
  messageLength = struct.unpack('@I', rawLength)[0]
  message = sys.stdin.read(messageLength)
  return message

# Encode a message for transmission,
# given its content.
def encodeMessage(messageContent):
  encodedContent = messageContent
  encodedLength = struct.pack('@I', len(encodedContent))
  return {'length': encodedLength, 'content': encodedContent}

# get data which was passed from the browser
instuff = getMessage()

# python subprocess runs an osascript command string with '-e' creating nextlines to enable a multi-line applescript.
# instuff is a json string
cmd = ("osascript -e 'on run args' -e 'tell application \"Adobe Illustrator\"' -e "
		"'set result to do javascript file \"~/Documents/Adobe Scripts/ColorhuntAiScript-2.jsx\" with"
		" arguments {item 1 of args}' -e 'return result' -e 'end tell' -e 'end run' '" + instuff + "'")

# check_output function returns the result from the command it runs. In this case it is an applecript which runs and retrieves the result
# of a .jsx extendscript.
result = subprocess.check_output([cmd], shell=True)


# python then relays the result back up to the browser tab with the following lines:
sys.stdout.write(struct.pack('I', len(result)))

sys.stdout.write(result)

sys.stdout.flush()

sys.exit(0)