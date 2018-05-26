import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
    name: '张某某'
  }
];

const Users = [];

for (let i = 0; i < 85; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    addr: Mock.mock('@county(true)'),
    'age|18-60': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1),
    productName:Mock.Random.word(2,4),
    description:Mock.Random.csentence(),
    price:Mock.Random.natural(1,100),
    image:Mock.Random.image(),
    category: Mock.Random.word(2,3),
    productDetail:[
      Mock.Random.image(),Mock.Random.image(),Mock.Random.image()
    ],
    phone:Mock.Random.string('number',13),
    userimgSrc: Mock.Random.image(),
    createTime:Mock.Random.date(),
    status:Mock.Random.integer(0,1),
    shopAccount: Mock.Random.string(6,13),
    password:Mock.Random.string('number',6,13)
  }));
}

export { LoginUsers, Users };
