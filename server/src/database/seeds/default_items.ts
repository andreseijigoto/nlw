import Knex from 'knex';

export async function seed(knex: Knex) {
  await knex('items').insert([
    { title: 'Lâmpadas', image: 'lamps.svg' },
    { title: 'Pilhas e Baterias', image: 'batteries.svg' },
    { title: 'Papéis e Papelão', image: 'papers.svg' },
    { title: 'Resíduos Eletrônicos', image: 'eletronics.svg' },
    { title: 'Resíduos Orgânicos', image: 'organics.svg' },
    { title: 'Óleo de cozinha', image: 'oils.svg' }
  ]);
}