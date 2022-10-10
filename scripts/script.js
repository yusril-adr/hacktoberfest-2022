const getUsers = async () => {
  const response = await fetch('./resources/users.json');
  const users = await response.json();

  const updatedUsers = await Promise.all(users.map(async (user) => {
    const response = await fetch(`https://api.github.com/users/${user.username}`);
    const data = await response.json();
    return { ...user, name: data.name, avatar: data.avatar_url };
  }));

  return updatedUsers;
};

const renderList = async (users) => {
  const list = document.querySelector('.row');

  if (users.length < 1) {
    list.innerHTML = `
      <div class="col-12">
        <p class="text-light text-center">No users found</p>
      </div>
    `;
    return;
  }

  list.innerHTML = "";
    users.forEach(user => {
      list.innerHTML += `
      <div class="col-12 col-md-6 col-lg-4 mb-4">
        <div class="card">
          <img src="${user.avatar}" class="card-img-top" alt="${user.username}">
          <div class="card-body">
            <p class="card-title mb-3">${user.name}</p>
            <p class="card-text text-ellipsis">${user.desc}</p>
            <div class="d-flex">
              <a href="https://github.com/${user.username}" class="btn btn-primary mx-auto">Visit Github</a>
            </div>
          </div>
        </div>
      </div>`;
    });
};

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const users = await getUsers();

    renderList(users);
  } catch (error) {
    alert("Something went wrong, please try again later.");
  }

  const form = document.querySelector("form");
  form.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();
      const keyword = e.target['search'].value;
      
      const users = await getUsers();
      const filteredUsers = users.filter(user => {
        return user.username.toLowerCase().includes(keyword.toLowerCase()) || user.name.toLowerCase().includes(keyword.toLowerCase());
      });

      await renderList(filteredUsers);
    } catch (error) {
      console.log(error);
      alert("Something went wrong, please try again later.");
    }
  })
});