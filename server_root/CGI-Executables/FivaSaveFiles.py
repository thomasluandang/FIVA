# first we need a HTML "form", like so
# <form method="POST" action="http://localhost/cgi-bin/FivaSaveFiles.py">
#	<p>Your first name: <input type="text" name="firstname"></p>
#	<p>Your last name: <input type= "text" name="lastname"></p>
#	<p>Click here to submit form: <input type="submit" value="Yeah!"></p>
# 	<input type="hidden" name="session" value="1f9a2">
# </form>
#
# and you need the python script, in this case FivaSaveFiles.py
# something like so
!/usr/local/bin/python # should this path be different on Mac or using Enthought?
import cgi

def main():
	print "Content-type: text/html\n"
	form = cgi.FieldStorage() # parse the query
	if form.has_key("firstname") and form["firstname"].value != "":
		print "<h1>Hello", form["firstname"].value, "</h1>"
	else:
		print "<h1>Error! Please enter first name.</h1>"

main()

# (g)dbm files - better scalability
import gdbm
key = "blah" # username or session key or whatever
db = gdbm.open("DATABASE", "w") # w means reading and writing
if db.has_key(key):
	data = db[key]	# read previous data
else:
	data = ""	# provide initial data
data = update (data, form)	# do what you need to do here
db[key] = data 	# write new data
db.close()

