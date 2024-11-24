const userData = [
  { id: 1, name: "Sammy", email: "sammy@gmail.com" },
  { id: 2, name: "John", email: "john@gmail.com" },
  { id: 3, name: "Jessica", email: "jessica@gmail.com" },
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
  // Deletes ALL existing entries
  await knex("user").del();
  await knex("user").insert(userData);
  await knex("camera").del();
  await knex("camera").insert(cameraData);
  await knex("post").del();
  await knex("post").insert(postData);
}
