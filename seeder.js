require('dotenv').config();
var seeder = require('mongoose-seed');

// Connect to MongoDB via Mongoose
seeder.connect(process.env.MONGODB_URL, function () {

    // Load Mongoose models
    seeder.loadModels(['models/order.js',
        'models/user.js',
        'models/product/category.js',
        'models/product/product.js',
        'models/product/size.js'
    ]);

    // Clear specified collections
    seeder.clearModels(['product','size','category'], function () {

        // Callback to populate DB once collections have been cleared
        seeder.populateModels(data, function () {
            seeder.disconnect();
        });

    });
});

//Data array containing seed data - documents organized by Model
var data = [
    {
        'model': 'size',
        'documents': [
            {
                'name': 'XXXL'
            },
            {
                'name': 'XXL'
            },
            {
                'name': 'XL'
            },
            {
                'name': 'L'
            },
            {
                'name': 'M'
            },
            {
                'name': 'S'
            },
            {
                'name': 'XS'
            }
        ]
    },
    {
        'model': 'category',
        'documents': [
            {
                'name': 'Clothing',
                'parents': [],
                'children': []
            },
            {
                'name': 'Tops',
                'parents': [],
                'children': []
            },
            {
                'name': 'Bottoms',
                'parents': [],
                'children': []
            },
            {
                'name': 'Shoes',
                'parents': [],
                'children': []
            },
            {
                'name': 'Accessories',
                'parents': [],
                'children': []
            },
            {
                'name': 'Jackets',
                'parents': [],
                'children': []
            },
            {
                'name': 'Shorts',
                'parents': [],
                'children': []
            },
            {
                'name': 'Skirts',
                'parents': [],
                'children': []
            },
            {
                'name': 'Boots',
                'parents': [],
                'children': []
            },
            {
                'name': 'Sneakers',
                'parents': [],
                'children': []
            },
            {
                'name': 'Socks',
                'parents': [],
                'children': []
            },
            {
                'name': 'Hats',
                'parents': [],
                'children': []
            },
            {
                'name': 'Sunglasses',
                'parents': [],
                'children': []
            },
        ]
    },
    {
        'model': 'product',
        'documents': [
            {
                'code': 'J001',
                'name': 'Leather Jacket',
                'price': 400,
                'sale': 10,
                'description': "Jacket with 100% leather",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : false
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'J002',
                'name': 'Black Cap',
                'price': 10,
                'sale': 0,
                'description': "Black basket ball cap made from cotton",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : true
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'C002',
                'name': 'White Cap',
                'price': 10,
                'sale': 0,
                'description': "White basket ball cap made from cotton",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : true
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'G001',
                'name': 'Green Glasses',
                'price': 110,
                'sale': 0,
                'description': "Green glasses with gold and black design",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : true
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'G002',
                'name': 'Rimless Glass',
                'price': 100,
                'sale': 0,
                'description': "Brown rimless glass",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : true
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'G003',
                'name': 'Round Glass',
                'price': 140,
                'sale': 0,
                'description': "Round glass green",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : true
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'S001',
                'name': 'Colorful Shorts',
                'price': 30,
                'sale': 0,
                'description': "Perfect shorts for summer",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : false
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'S002',
                'name': 'Short Jeans',
                'price': 50,
                'sale': 0,
                'description': "Short Jeans for women",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : false,
                    'female' : true
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'S003',
                'name': 'Orange Shorts',
                'price': 50,
                'sale': 0,
                'description': "Activewear orange shorts",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : false
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'S001',
                'name': 'Swim Shorts',
                'price': 40,
                'sale': 0,
                'description': "Green swim shorts for men",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : false
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'SK001',
                'name': 'Blue Skirt',
                'price': 60,
                'sale': 10,
                'description': "Checked blue skirt",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : false,
                    'female' : true
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'SK002',
                'name': 'Pink Skirt',
                'price': 60,
                'sale': 0,
                'description': "Checked pink skirt",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : false,
                    'female' : true
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'SK003',
                'name': 'Black Skirt',
                'price': 60,
                'sale': 0,
                'description': "Flounce black skirt",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : false,
                    'female' : true
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'SN001',
                'name': 'Black Sneakers',
                'price': 160,
                'sale': 0,
                'description': "Comfortable running shoes",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : false
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'SN002',
                'name': 'Green Sneakers',
                'price': 160,
                'sale': 20,
                'description': "Comfortable running shoes",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : false
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'SN003',
                'name': 'Pink Sneakers',
                'price': 150,
                'sale': 0,
                'description': "Comfortable running shoes",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : false,
                    'female' : true
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'SO001',
                'name': 'White Socks',
                'price': 10,
                'sale': 0,
                'description': "Comfortable White socks",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : true
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'SO002',
                'name': 'Black Socks',
                'price': 10,
                'sale': 0,
                'description': "Comfortable Black socks",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : true
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'SO003',
                'name': 'Black and White Socks',
                'price': 10,
                'sale': 0,
                'description': "Comfortable Black and White socks",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : true
                },
                'orders': [],
                'categories': []
            },
            {
                'code': 'B001',
                'name': 'Brown Boots',
                'price': 350,
                'sale': 0,
                'description': "Comfortable Long boots",
                'sizeAndQuantityAvailable': [],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : true
                },
                'orders': [],
                'categories': []
            },
        ]
    }
];