const userData = [
  {
    id: 1,
    name: "Harrison",
    email: "harry@gmail.com",
    password: "$2b$08$C5g2th6VkjZyqdOwTehx4OcyaQ.Odet5iLGc0R/D2wLlEXX94gaum",
    pot: 100,
    likes: 0,
    admin: true,
  },
  {
    id: 2,
    name: "John",
    email: "john@gmail.com",
    password: "$2b$08$C5g2th6VkjZyqdOwTehx4OcyaQ.Odet5iLGc0R/D2wLlEXX94gaum",
    pot: 100,
    likes: 0,
    admin: false,
  },
  {
    id: 3,
    name: "Jessica",
    email: "jessica@gmail.com",
    password: "$2b$08$C5g2th6VkjZyqdOwTehx4OcyaQ.Odet5iLGc0R/D2wLlEXX94gaum",
    pot: 100,
    likes: 0,
    admin: false,
  },
];
let postData = [];

function createPostsDummy() {
  function isOdd(num) {
    return num % 2;
  }
  for (let i = 0; i <= 42; i++) {
    let ratio = "";
    if (isOdd(i)) {
      ratio = "1440/1050";
    } else {
      ratio = "1050/1440";
    }
    postData.push({
      id: i,
      title: `Post Number ${i}`,
      content: `This is the content of post number ${i}.`,
      user_id: 1,
      image_url: `https://picsum.photos/id/${i}/${ratio}`,
      camera_id: 1,
    });
  }
}

const cameraData = [
  {
    id: 1,
    camera_model: "DSC 520",
    camera_year: 1999,
    camera_brand: "canon",
  },
];

export async function seed(knex) {
  await createPostsDummy();
  await knex("user").del();
  await knex("user").insert(userData);
  await knex("camera").del();
  await knex("camera").insert(cameraData);
  await knex("post").del();
  await knex("post").insert(postData);
}
