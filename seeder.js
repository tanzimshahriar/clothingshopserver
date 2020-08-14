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
    seeder.clearModels(['product'], function () {

        // Callback to populate DB once collections have been cleared
        seeder.populateModels(data, function () {
            seeder.disconnect();
        });

    });
});

//Data array containing seed data - documents organized by Model
var data = [
    // {
    //     'model': 'size',
    //     'documents': [
    //         {
    //             'name': 'XXXL'
    //         },
    //         {
    //             'name': 'XXL'
    //         },
    //         {
    //             'name': 'XL'
    //         },
    //         {
    //             'name': 'L'
    //         },
    //         {
    //             'name': 'M'
    //         },
    //         {
    //             'name': 'S'
    //         },
    //         {
    //             'name': 'XS'
    //         }
    //     ]
    // },
    // {
    //     'model': 'category',
    //     'documents': [
    //         {
    //             'name': 'Clothing',
    //             'parents': [],
    //             'children': []
    //         },
    //         {
    //             'name': 'Shoes',
    //             'parents': [],
    //             'children': []
    //         },
    //         {
    //             'name': 'Accessories',
    //             'parents': [],
    //             'children': []
    //         },
    //         {
    //             'name': 'Watches',
    //             'parents': [],
    //             'children': []
    //         }
    //     ]
    // },
    {
        'model': 'product',
        'documents': [
            {
                'code': 'J001',
                'name': 'Leather Jacket',
                'price': 100,
                'sale': 10,
                'description': "This is a black leather jacket.",
                'sizeAndQuantityAvailable': [
                    {
                        'size' : '5f36635c7ee9d624c42c7f3f', 
                        'quantityAvailable': 10
                    },
                    {
                        'size' : '5f36635c7ee9d624c42c7f40', 
                        'quantityAvailable': 20
                    },
                    {
                        'size' : '5f36635c7ee9d624c42c7f41', 
                        'quantityAvailable': 30
                    },
                ],
                'images': [],
                'gender': {
                    'male' : true,
                    'female' : false
                },
                'orders': [],
                'categories': ['5f366131326f1b28043d8c31']
            },
            {
                'code': 'J001',
                'name': 'Adidas Originals',
                'price': 120,
                'sale': 0,
                'description': "This is an epicly comfortable sneaker",
                'sizeAndQuantityAvailable': [
                    {
                        'size' : '5f36635c7ee9d624c42c7f40', 
                        'quantityAvailable': 50
                    },
                    {
                        'size' : '5f36635c7ee9d624c42c7f41', 
                        'quantityAvailable': 60
                    },
                ],
                'images': [],
                'gender': {
                    'male' : false,
                    'female' : true
                },
                'orders': [],
                'categories': ['5f366131326f1b28043d8c33', '5f366131326f1b28043d8c32']
            },
        ]
    }
];