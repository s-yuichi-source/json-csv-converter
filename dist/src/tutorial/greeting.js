import PersonService from '@/domains/person/PersonServiceImpl';
import User from '@/domains/person/User';
export default class Greenting {
    constructor() {
        this.personService = new PersonService;
        this.user = new User();
        this.greet = () => {
            this.user = this.personService.initUserInfo(this.user);
            return "Hello " + this.user.firstName + this.user.lastName;
        };
    }
}
;
