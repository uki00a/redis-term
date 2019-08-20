import faker from 'faker';

function redisKey() {
  return faker.random.uuid();
}

export default {
  redisKey
};