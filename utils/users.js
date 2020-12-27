const users = [];

const addUser = ({ id, name, room }) => {
  //clean extra spaces
  name = name.trim();
  room = room.trim();

  //Validation
  if (!name || !room) {
    return {
      err: 'Name and room are required',
    };
  }

  const doesUserExist = users.find(
    (user) => user.room === room && user.name === name
  );

  if (doesUserExist) {
    return {
      err: 'Username already taken',
    };
  }

  const user = { id, name, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id == id;
  });
  
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  const user = users.find((user) => (user.id === id ? user : undefined));
  return user;
};

const getRoomUsers = (room) => {
  room = room.trim();
  return users.filter((user) => {
    return user.room === room
  })
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getRoomUsers,
};
