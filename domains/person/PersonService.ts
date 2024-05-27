import User from '@/domains/person/User'

export default interface PersonService {
    initUserInfo: (user: User) => User;
}