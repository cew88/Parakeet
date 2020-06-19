#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun Aug  4 17:44:23 2019

@author: kevin
"""

def do_work(*args):
	#Google Speech Recognition (default API key)
  import speech_recognition as sr
	r = sr.Recognizer() #read audio in
	m = sr.Microphone() #Mic access through PyAudio
	try:
			print("Adjusting for Ambient Noise")
			print("A Moment of Silence Please")
			with m as source: r.adjust_for_ambient_noise(source)
			print("Set minimum energy threshold to {}".format(r.energy_threshold))
			while True:
					with m as source:
							print("Say something!")
							audio = r.listen(source)
					try:
							# to use another API key, use `r.recognize_google(audio, key="API_KEY")`
							words = r.recognize_google(audio)
							splitfile = words.split()
							print("Google Speech Recognition thinks you said " + words)
					except sr.UnknownValueError:
							print("Google Speech Recognition could not understand audio")
					except sr.RequestError as e:
							print("Could not request results from Google Speech Recognition service; {0}".format(e))
	except KeyboardInterrupt:
			pass

import micropip
micropip.install('SpeechRecognition').then(do_work)