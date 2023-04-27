# RakBank
## Pre-requisites

- Node JS should be installed minimum 14 version
- Typescript should be installed `npm install -g typescript`

### Storybook installation and run process on local environment

1. cd `src/ui-components` 
1. `npm install`
1. `npm run storybook` to launch Storybook

### Storybook build deployment 

1. cd `src/ui-components`
1. `npm run build-storybook`
1. find the folder with given path "rakbankwebsite2.0\src\ui-components\storybook-static"
1. deploy the build any of your FTP instance

## Local Sitecore dev install

This section describes Sitecore installation process for the plugin development and testing purposes.

Setup process is built using Sitecore Installation Framework (SIF) with additional tweaks.

### Prerequisites

The given list of software must be installed prior using any further instructions.
Unless stated otherwise, everything must be installed and used on the same developer
workstation (physical or virtual machine).

- Windows 10 or Server 2016 with Administrator user account
- SQL Server 2016/7 (any edition) with
  - the `sa` SQL user account enabled and password set
  - contained database is enabled with the sql script and manual SQL service restart afterwards:
    ```
    Use master
    GO
    sp_configure 'show advanced options', 1
    GO
    RECONFIGURE WITH OVERRIDE
    GO
    sp_configure 'contained database authentication', 1
    GO
    RECONFIGURE WITH OVERRIDE
    GO
    sp_configure 'show advanced options', 0
    GO
    RECONFIGURE WITH OVERRIDE
    GO
    ```
- Visual Studio 2017 or later (any edition)
- [Java runtime](https://www.oracle.com/technetwork/java/javase/downloads/jre8-downloads-2133155.html)
- DisableLoopbackCheck.reg is added to registry (execute the file from Windows Explorer)
- Open Command Line prompt (not Powershell) as administrator and execute following commands:

  ```
  %windir%\system32\inetsrv> appcmd.exe unlock config -section:system.webServer/security/authentication/anonymousAuthentication
  %windir%\system32\inetsrv> appcmd.exe unlock config -section:system.webServer/security/authentication/windowsAuthentication
  ```

- IIS is enabled with the following features:

  - Web Server
    - Common HTTP Features
      - Default Document
      - HTTP Errors
      - Static Content
    - Health and Diagnostics
      - HTTP Logging
      - Logging Tools
      - Tracing
    - Security
      - Basic Authentication
      - Windows Authentication
    - Application Development
      - .NET Extensibility 4.5
      - ASP.NET 4.5
  - Management Tools
    - IIS Management Console
    - IIS Management Scripts and Tools

- Sitecore files are downloaded and located to specific directories:

* Create `C:\Sitecore\Settings` folder with files as follows:

  - the `.\wwwroot.txt` file with folder for Sitecore instances to be installed:

    ```
    C:\www
    ```

    **Note**, it is suggested to use `C:\www` because it is easy to type and it does not depend on security settings inherited from `C:\inetpub`

  - the `.\solrroot.txt` file with folder where Solr is installed, or will be installed automatically later:

    ```
    C:\etc
    ```

  - the `.\password.txt` file with preferred password for `sitecore\admin` account:

    ```
    b
    ```

  - the `.\SqlServer.txt` file with SQL Server network name, for example:

    ```
    .\SQLSERVER
    ```


    * the `.\SqlAdminUser.txt` file with SQL admin user account name:

        ```
        sa
        ```

    * the `.\SqlAdminUser.txt` file with SQL admin user account password:

        ```
        12345
        ```

- Copy `license.xml` file to `C:\Sitecore\Licenses` folder

### Installation

Once prerequisites are met, proceed to the setup by executing `.\Install.ps1` from `setup` directory.

**Note**, the scripts are also equipped with `.\Uninstall.ps1` file to remove installed instance, it may however need to be executed several times if it terminates with error.

The setup process is divided into two parts executed sequentially:

- `_Prerequsites.ps1` that downloads and installs additional prerequsites if necessary
- `_Install.ps1` that actually installs Sitecore components
