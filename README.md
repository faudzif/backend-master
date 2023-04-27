# RakBank

## Cloning the repo

1.  Create personal token:
    [https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops)

        Copy this token to clipboard.

1.  Base64 encode the string in the following format: "username:token"
    where:

    - username - your TFS username
    - token: token retrieved on step 1.

    For example:
    `michael.caine:asat124as651231231`

    For convenience, you can use this online tool: [https://www.blitter.se/utils/basic-authentication-header-generator/](https://www.blitter.se/utils/basic-authentication-header-generator/)

1.  Use the resulting base64 string instead of "<base64encodedstring>" when executing the following command in cmd:

    ```
    git config --global http.extraHeader "Authorization: Basic <insert-base64-encoded-string here>"
    ```

    **Note**, this may break other git repos that do not belong to https://tfs.dtcm.gov.ae. To avoid this, follow alternative approach:

    ```
    mkdir VD
    cd VD
    git init
    git config http.extraHeader "Authorization: Basic <insert-base64-encoded-string here>"
    git remote add origin https://tfs.dtcm.gov.ae/DefaultCollection/VDDOT/_git/VD
    git pull
    ```

1.  Clone the repo as usual: `git clone https://tfs.dtcm.gov.ae/DefaultCollection/VDDOT/_git/VD`

## Pre-requisites

- Sitecore 9.1.1 in either XM0 or XP0 configuration installed
- Latest version of Sitecore JavaScript Services Server for Sitecore 9.1 installed and configured according to JSS docs

## Server-side development

1.  Run `AfterInstall.ps1` from `.\setup` (`Set-ExecutionPolicy Unrestricted` before it, if needed). Specify the path to your Sitecore installation.
2.  Run `GeneratePublishProfiles.ps1` in the `src\server\Build` folder.
    Specify the path to your Sitecore installation.
3.  Open the .sln, do build
4.  Hit F5 (Run) on the "Build" VS project within the solution

    > This project does triggers MSBuild and publish into your Sitecore instance.

5.  Launch Unicorn (`/unicorn.aspx`) and Sync the DOT site project.

## Front-end development

### Before you get started

1. Open Azure DevOps artifacts and the `main` feed:
    https://tfs.dtcm.gov.ae/DefaultCollection/VD/_packaging?_a=package&feed=main&package=%40dtcm%2Fui-components&protocolType=Npm&version=1.0.30
1. Click *Connect to feed*.
1. Select npm and *Generate npm credentials* copy the credentials into your global npmrc file (in Windows typically in `C:\Users\<your-login></your-login>\.npmrc` file). 
1. Create `.npmrc` under `.\src\apps\dotsite` and `.\src\ui-components` with the following contents:
    ```
    @dtcm:registry=https://tfs.dtcm.gov.ae/DefaultCollection/_packaging/main/npm/registry/
    always-auth=true
    ```
### Component development

1. cd `.\src\ui-components`
1. `npm install`
1. `npm run storybook` to launch Storybook
1. `npm run start` to launch a sandbox CRA that renders all the components outside of Storybook.

### Component library publishing

The component library is built from `master` on every commit and a new version is pushed to the Azure DevOps artifact store:
https://tfs.dtcm.gov.ae/DefaultCollection/VD/_packaging?_a=package&feed=main&package=%40dtcm%2Fui-components&protocolType=Npm&version=1.0.30

### Sitecore JSS app development

1. cd `.\src\apps\dotsite`
1. `npm run start`
1. `jss setup` and follow the steps to establish connection to your Sitecore instance.
1. `jss start:connected` to launch development against content from a running Sitecore instance.

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
