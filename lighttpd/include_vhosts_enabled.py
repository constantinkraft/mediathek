#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os

DIR_VHOSTS  = "/etc/lighttpd/vhosts-enabled"

os.chdir(DIR_VHOSTS)

for f in os.listdir('.'):
	print ("include \"vhosts-enabled/"+f+"\"")
