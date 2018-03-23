blockchain-certificates
=======================

This project allows an institution to issue digital certificates. It creates pdf certificate files (or uses existing ones) and issues a hash representing those files into the Bitcoin network's blockchain. 

=======================

Create, Issue and Validate.

$ create-certificates -c path/to/working_directory/config.ini

$ issue-certificates -c path/to/working_directory/config.ini

$ validate-certificates -c path/to/working_directory/config.ini -f cert1.pdf 


