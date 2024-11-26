const userData = [
  {
    id: 1,
    name: "Harrison",
    email: "sammy@gmail.com",
    password: "$2b$08$C5g2th6VkjZyqdOwTehx4OcyaQ.Odet5iLGc0R/D2wLlEXX94gaum",
    admin: "false",
  },
  {
    id: 2,
    name: "John",
    email: "john@gmail.com",
    password: "$2b$08$C5g2th6VkjZyqdOwTehx4OcyaQ.Odet5iLGc0R/D2wLlEXX94gaum",
    adming: "false",
  },
  {
    id: 3,
    name: "Jessica",
    email: "jessica@gmail.com",
    password: "$2b$08$C5g2th6VkjZyqdOwTehx4OcyaQ.Odet5iLGc0R/D2wLlEXX94gaum",
    admin: "false",
  },
];
const postData = [
  {
    id: 1,
    title: "First Post",
    content: "Hello world!",
    user_id: 2,
    like: 5,
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Dhole%28Asiatic_wild_dog%29.jpg/640px-Dhole%28Asiatic_wild_dog%29.jpg",
    camera_id: 1,
  },
  {
    id: 2,
    title: "Second Post",
    content: "Hello another world!",
    user_id: 3,
    like: 11,
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Canis_lupus_familiaris.001_-_Monfero.jpg/640px-Canis_lupus_familiaris.001_-_Monfero.jpg",
    camera_id: 1,
  },
];

const cameraData = [
  {
    id: 1,
    camera_model: "DSC 520",
    camera_year: 1999,
    camera_brand: "canon",
  },
];

export async function seed(knex) {
  await knex("user").del();
  await knex("user").insert(userData);
  await knex("user").update(user.password);
  await knex("camera").del();
  await knex("camera").insert(cameraData);
  await knex("post").del();
  await knex("post").insert(postData);
}
