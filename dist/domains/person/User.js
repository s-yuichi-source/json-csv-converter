export default class User {
    constructor(id = '', // 型が明示的にわかる場合は型定義は書かなくてもOK
    firstName = '', // = ''をしたことで、自動で型推論をしてくれている
    lastName = '') {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
