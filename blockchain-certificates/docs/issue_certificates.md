## Issue PDF certificates 
This method allows an institution to issue digital certificates. It issues existing PDF certificate files and publishes a hash representing those files into the Bitcoin network's blockchain. The general process is as follows:
  - All the PDF certificates are expected. A CSV with the certificates data is used to add metadata to each certificate; all PDF certificates now include the metadata
  - The PDF certificates are hashed (sha256) and a merkle tree is created, the merkle root of which is published into the blockchain

## Requirements
To use one needs to satisfy the following:
  - Have a local Bitcoin node running (testnet or mainnet)
  - Have python 3 installed and knowledge on using virtualenv
  - Basic knowledge of the operating system (examples are given on a Debian-based linux system)

## Installation
Create a new python virtual environment

`$ python3 -m venv new_py3_env`

Activate new environment

`$ source new_py3_env/bin/activate`

Get the code from github and go to that directory (a package python might be created in the future)

`$ git clone https://github.com/UniversityOfNicosia/blockchain-certificates.git && cd blockchain-certificates`

Run setup to install

`$ pip install .`


## Scripts and Usage
The script that will be made available is `issue-certificates`. Optionally `validate_certificates` can be used after issuing to validate the certificates. Both take several command-line options and option `-h` provides help. However, we do strongly recommend to use a config file to configure the scripts. Both scripts use the same configuration file since they share options. You can then, if needed, use some of the command-line options to override options from the configuration file.

In addition to setting up the configuration file (consult the following section) one needs to provide:

__CSV graduates file__
:	This is a CSV file that contains all the data that we wish to include as metadata for each certificate. It could contain extra columns that will be ignored. The header of the file should contain the names of the columns and those names are used to match the `cert_metadata_columns` that are selected to go to the `metadata_object`.

__Existing certificates__
:	Place all existing certificates in the directory specified by `certificates_directory`

### Best Practices
We recommend to create a new folder (working directory) where everything will take place. Thus, all files used and all files created are organized properly in one place.

Example:
```
working_directory
      |--- certificates/
      |--- graduates.csv
      `--- config.ini
```

### Usage: `issue-certificates`
Issues the certificates in the `certificates_directory` after adding the appropriate metadata. The PDF metadata `metadata_object` is added to the PDF. It is a JSON object that always contains `issuer` and `issuer_address` as well as all the fields specified in `cert_metadata_columns`. Following is the creation of a merkle tree that contains all the hashes of the certificates, the merkle root of which is published to the blockchain. A corresponding chainpoint receipt is added as metadata `chainpoint_proof` in each PDF certificate. The compulsory metadata are `metadata_object`, and `chainpoint_proof`.

Given the example directory structure from above and a proper config.ini file it is as simple as:

```
$ issue-certificates -c path/to/working_directory/config.ini
```

The script will confirm the arguments passed and then it will add the metadata to the certificates and publish the merkle root hash to the blockchain. The certificates are finished, self-contained and ready to be shared.


### Usage: `validate-certificates`
This script can be used to validate certificates issued in the past or issued by others. You pass the certificates that you want to validate as arguments as well as the `hash_prefix` (if added when issuing) and whether it was issued on mainnet or testnet.

Given the example directory structure from above and a proper config.ini file it is as simple as:

```
$ validate-certificates -c path/to/working_directory/config.ini -f cert1.pdf cert2.pdf cert3.pdf
```

## Configuration Options (config.ini)

|Option|Explanation and example|
|------|-----|
|**Global**||
|working_direcory|The working directory for issuing the certificates. All paths/files are always relative to this directory. Example: `/home/kostas/spring_2016_graduates`|
|**PDF certificates related**||
|graduates_csv_file|The name of the comma separated value file that contains individual information for each graduate. It is relative to `working_directory`. Example: `graduates.csv`|
|certificates_directory|The directory were all the new certificates will be stored. It is recommended that this directory is always empty before running the script. If it doesn't exist it will be created. It is relative to `working_directory`. Example: `certificates`|
|certificates_global_fields|A simple key-value object that contains data for the `pdf_cert_template` to fill in fields that are common to all graduates. Given that there is a field called `date ` for the date that the certificate was awarded an example would be: `{"date": "5 Dec 2016"}`|
|issuer|The name of the issuer/institution. Example: `UNIVERSITY OF NEVERLAND`|
|**CSV file related**||
|cert_names_csv_column|Specifies the header of the column to use to identify the certificate that the metadata are going to be inserted to. Note that the certificate file needs to start with the value of the column but it could be more complex. Obviously, it has to be unique for each row. It is typical to use a graduate identifier for this column. Given that `graduates_csv_file` contains a column with header `student_id` with all the student identifiers of the graduates an example value would be: `student_id`|
|cert_metadata_columns|Specifies the header of the columns and the respective data to be added in the `metadata_object` for each individual certificate. Global fields, as specified by `certificates_global_fields` can also be specified here to be included in the metadata.|
|**Blockchain related**|*Note: currently only Bitcoin's blockchain is supported.*|
|issuing_address|The Bitcoin (testnet or mainnet) address to use for creating the OP_RETURN transaction that will issue the index document's hash in the blockchain. It has to have sufficient funds to cover just the fees of the transaction. If more funds are present we send them back as change to the same address. Make sure that you have the private key for this address safe since that might be the only formal way of proving who issued the certificates. Example for testnet: `mgs9DLttzvWFkZ46YLSNKSZbgSNiMNUsdJ`|
|full_node_url|The URL of the full node together with the port. Example for testnet: `127.0.0.1:18332`
|full_node_rpc_user|The name of the RPC user as configured in bitcoin.conf of the full node. Note that the RPC password is going to be asked during execution of the `create-certificates` script. Example: `kostasnode`|
|testnet|Specifies whether it will use testnet of mainnet to issue the hash. Example: `true`|
|tx_fee_per_byte|Specifies the mining fee to use per byte of the transaction's size. Consult https://bitcoinfees.21.co or another site for possible values. Example value on Jan 2017 is: `100`|
|hash_prefix|It is possible to prepend the index document's hash with a value to differentiate this OP_RETURN transaction from others. You should provide directly the hex value here using any online conversion tool to convert to hex. It is optional and you can comment it out for no prefix. Example value for prepending the string "ULand " is: `554c616e6420`.

## Example project to experiment
The `sample_issue_certs_dir` directory in the root of the project contains everything needed to create the PDF certificates and the index file. Just run the process again to add the metadata and issue the merkle root to the blockchain. Note that the sample `config.ini` needs to be updated with the path that the `sample_issue_certs_dir` is as well as with the proper Bitcoin address and RPC user name for the actual issuing. We recommend using testnet until you feel comfortable.

