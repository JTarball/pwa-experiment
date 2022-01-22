// ts not supported

import { LitState, stateVar } from 'lit-element-state';

class MyState extends LitState {
    static get stateVars() {
        return {
            counter: 0,
           jwt_token: "",
           loggedIn: false
        };
    }

    // static get stateVars() {
    //     return {
    //         jwt_token: ""
    //     };
    // }
}

export const myState = new MyState();