import Axios from "axios";

const request = Axios.create({
    validateStatus: function (status) {
        return true; // status >= 200 && status < 300; // default
    }
})
export class Github {
    static async getRepoInfo(repo: string) {
        // https://api.github.com/repos/ujjwalguptaofficial/fortjs
        return request.get(`https://api.github.com/repos/${repo}`);
    }
    static async downloadRepo(repo: string) {
        const repoInforesponse = await Github.getRepoInfo(repo);
        if (repoInforesponse.status === 200 || repoInforesponse.status === 201) {
            const response = await request.get(`https://api.github.com/repos/${repo}`);
            return response.status === 200 || response.status === 201;
        }
        else {
            console.log(`Invalid repo - repo ${repo} does not exist`);
        }
    }

}