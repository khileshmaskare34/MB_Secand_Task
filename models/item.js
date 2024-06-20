const express = require('express')
const db = require('../config/db');
const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
})

const Item = mongoose.model('Item', itemSchema);
module.exports = Item