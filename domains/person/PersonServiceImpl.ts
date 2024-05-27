import PersonService from '@/domains/person/PersonService';
import User from '@/domains/person/User';

export default class PersonServiceImpl implements PersonService {
    readonly USER_ID = 'user001';
    readonly FIRST_NAME = 'User';
    readonly LAST_NAME = 'Test';

    initUserInfo(userInfo: User): User {
        userInfo.id = this.USER_ID;
        userInfo.firstName = this.FIRST_NAME;
        userInfo.lastName = this.LAST_NAME;
        return userInfo;
    }
}