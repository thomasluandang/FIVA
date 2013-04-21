#!/usr/local/bin/python
import cgi
import cgitb
cgitb.enable()

httpRootDirEndWithSlash = "/Users/isitdev/Dropbox/FIVA_project/releasecandidate6/WebServer/Documents/webroot/"

# Load a html template and substitute strings
def template(file, vars):
    return open(file, 'r').read() % vars

def main():
	print "Content-type: text/html\n"

	loginSuccessful = 0
	form = cgi.FieldStorage() # parse the query
	if form.has_key("username") and form["username"].value != "":
		if form["username"].value == "Cifer":
			if form.has_key("password") and form["password"].value == "Freedom65":
				loginSuccessful = 1
				print template(httpRootDirEndWithSlash + "fiva09.tpl", {'user':form["username"].value})
	
	if loginSuccessful == 0:
		print """<html>
					<body style="background-color:#eeeeee;">
						<h3>Error! Please re-enter your username and password (case sensitive).</h3>
						<form method="POST" action="/cgi-bin/login.py">
							<p>Username: <input type="text" name="username"></p>
							<p>Password: <input type= "text" name="password"></p>
							<p> 
								<input type="submit" value="Login">	
							</p>
					 		<input type="hidden" name="session" value="1f9a2">
					 	</form>
					</body>
					</html> 
			"""

main()

