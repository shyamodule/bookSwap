// const bookSchema = require('./schemas.js');
// const Joi = require('Joi')
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});
const Joi = BaseJoi.extend(extension);

const bookSchema = Joi.object({
    bookEntry: Joi.object({
        title: Joi.string().required().escapeHTML(),
        writer: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array()
});

// const b = JSON.parse(JSON.stringify([Object: null prototype] {
//     bookEntry: [Object: null prototype] {
//       title: 'sullen',
//       writer: 'grunt',
//       location: 'Delhi',
//       price: '100',
//       description: 'esw'
//     }
//   }));

const {error} = bookSchema.validate({
        bookEntry: {
          title: 'sullen',
          writer: 'grunt',
          location: 'Delhi',
          price: '100',
          description: 'esw'
        }
      });
console.log(error)


// book shelf container - createBookEntry assesss console.log
// show.ejs - changed submitted by author.username 