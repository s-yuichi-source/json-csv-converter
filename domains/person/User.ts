export default class User {
    constructor(
        public id: string = '', // 型が明示的にわかる場合は型定義は書かなくてもOK
        public firstName = '', // = ''をしたことで、自動で型推論をしてくれている
        public lastName = ''
    ) { }
}