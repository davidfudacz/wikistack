const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/wikistack');

const Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  status: Sequelize.ENUM('open','closed'),

},
{
  hooks: {
    beforeValidate: function (page, options) {
      if (page.title) {
        // Removes all non-alphanumeric characters from title
        // And make whitespace underscore
        page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
      } else {
        // Generates random 5 letter string
        page.urlTitle = Math.random().toString(36).substring(2, 7);
      }

    }
  },
  getterMethods: {
    route() {
      return '/wiki/'+this.urlTitle;
    }
  },
  setterMethods: {
    
  }
});

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    }
  },
},
  {
    getterMethods: {
      route() {
        return '/users/'+this.id;
      }
    },
    setterMethods: {
      
    }
});

Page.belongsTo(User,{as: 'author'});



module.exports = {
  db,
  Page,
  User,
}
