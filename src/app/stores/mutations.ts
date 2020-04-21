import { STORE_MUTATION } from "../enums";

export default {
    [STORE_MUTATION.SetApps]: (state, data) => {
        console.log("apps", data);
        state.apps = data;
    }
}