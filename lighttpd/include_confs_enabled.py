#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

DIR_CONFS   = "/etc/lighttpd/conf-enabled"

os.chdir(DIR_CONFS)

for f in os.listdir('.'):
	print ("include \"conf-enabled/"+f+"\"")
