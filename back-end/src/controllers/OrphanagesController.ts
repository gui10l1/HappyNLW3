import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';
import orphanageView from '../views/orphanages_view';
import * as Yup from 'yup';

export default {
  async index(request: Request, response: Response) {
    //Capturando um repositório de Orfanatos (MODEL) dentro de uma variável
    const orphanagesRepository = getRepository(Orphanage);

    //Pega todos os orfanatos de dentro do repositório de Orfanatos em uma variável
    const orphanages = await orphanagesRepository.find({
      //Cria uma regra para retornar também os valores do relacionamento
      relations: ['images']
    });

    //Retorna um status HTTP e os orfanatos em formato JSON
    return response.status(200).json(orphanageView.renderMany(orphanages));
  },

  async show(request: Request, response: Response) {
    const { id } = request.params

    //Capturando um repositório de Orfanatos (MODEL) dentro de uma variável
    const orphanagesRepository = getRepository(Orphanage);

    //Pega todos os orfanatos de dentro do repositório de Orfanatos em uma variável
    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      //Cria uma regra para retornar também os valores dp relacionamento
      relations: ['images']
    });

    //Retorna um status HTTP e os orfanatos em formato JSON
    return response.status(200).json(orphanageView.render(orphanage));
  },

  //Método que vai criar um novo orfanato
  async create(request: Request, response: Response) {
    //Desestruturando o request.body
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    } = request.body;

    //Capturando um repositório de Orfanatos (MODEL) dentro de uma variável
    const orphanagesRepository = getRepository(Orphanage);

    //Pega todos os arquivos da da requisição e coloca numa variável do tipo Express.Multer.File[]
    const requestImages = request.files as Express.Multer.File[];

    //Mapeia todas asa imagens e retona o nome delas como o path
    const images = requestImages.map(image => {
      return { path: image.filename }
    });

    //Define uma variável com os dados a serem preenchidos
    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
      images
    }

    //Define a validação para cada campo
    const schema = Yup.object().shape({
      name: Yup.string().required('Nome é obrigatório'),
      latitude: Yup.number().required('Latidute é obrigatório'),
      longitude: Yup.number().required('Latidute é obrigatório'),
      about: Yup.string().required('Sobre é obrigatório').max(300, 'Máximo de caracteres: 300'),
      instructions: Yup.string().required('Instruções são obrigatórias'),
      open_on_weekends: Yup.boolean().required('Aberto nos fins de semana deve conter valor'),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required('Deve conter imagens')
        })
      ),
    });

    //Executa a validação
    await schema.validate(data, {
      //Parar na primeira falha: false
      abortEarly: false
    })

    //Criando um novo orfanato da model orfanato por meio da variável de repositório 
    const orphanage = orphanagesRepository.create(data);

    //Salvando o orfanato que foi criado
    await orphanagesRepository.save(orphanage);

    //Retornando um status HTTP e o orfanato que foi criado em formato JSON 
    return response.status(200).json(orphanage);
  }
}