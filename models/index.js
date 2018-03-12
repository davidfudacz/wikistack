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
  status: {
    type: Sequelize.ENUM('open','closed'),
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
  },

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
      // var TagList = page.tagString.trim().split(',');

      // page.tags = TagList;
    }
  },
  getterMethods: {
    route() {
      return '/wiki/'+this.urlTitle;
    },
    tagOutput() {
      return this.tags.join(',');
    }
  },
  setterMethods: {
    tagInput(inputString) {
      this.tags = tagInput.trim().split(',');
      for (var K = 0; K < this.tags.length; K++) {
        this.tags[K].trim();
        if (!tags[K]) {
          // tags.remove(K);
        }
      }
    }
  }
});

Page.findByTag = function (str) {
  let list = str.split(' ');

  Page.findAll({
    // $overlap matches a set of possibilities
    where : {
        tags: {
            $overlap: list
        }
    }    
})
.then(function (result) {
  return result;
});
};

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
