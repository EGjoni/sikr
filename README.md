Note that the bash script relies on jq to parse through json. So make sure it's installed.
 
Currently, there are some parts of posts that are not archived, feel free to modify the tables and scripts to include them. 

There are places in the archive bash script and php files that require your api key. grep for [PLACE YOUR API KEY HERE]
Also grep for [DIRECTORY UNDER WHICH YOU PUT THE ARCHIVE BASH FILE], and replace that with what it should be. 

Make sure to replace the $user and $db variables with whatever is appropriate for your server configuration in the www/*.php files. 
You will also need to modify the sql commands in the bash script to reference your server config.

It would be awfully nice to include a post preview feature as opposed to just displaying raw unformatted text to the user. 
If you add this functionality, please merge it back.

To create the required tables, either run the sikr.sql file as is, or cherry pick the portions you want as required by your current setup. 
If you've never configured php to work with postgres before -- well, have fun.




