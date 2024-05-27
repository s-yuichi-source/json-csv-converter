export default class PersonServiceImpl {
    constructor() {
        this.USER_ID = 'user001';
        this.FIRST_NAME = 'User';
        this.LAST_NAME = 'Test';
    }
    initUserInfo(userInfo) {
        userInfo.id = this.USER_ID;
        userInfo.firstName = this.FIRST_NAME;
        userInfo.lastName = this.LAST_NAME;
        return userInfo;
    }
}
