import commandExists from 'command-exists';
export async function isCmdExist(cmdName: string) {
    let result = await new Promise((res) => {
        commandExists(cmdName)
            .then(function (command) {
                res(true);
            }).catch(function () {
                res(false);
            });
    })
    return result;
}