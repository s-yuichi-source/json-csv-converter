import PersonService from '@/domains/person/PersonServiceImpl';
import User from '@/domains/person/User';

export default class Greenting {

    personService: PersonService = new PersonService;

    user: User = new User();

    greet = (): string => {
        this.user = this.personService.initUserInfo(this.user);
        return "Hello " + this.user.firstName + this.user.lastName;
    };
};
