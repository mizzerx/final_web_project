const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  course_id: mongoose.Schema.Types.ObjectId,
});

const Topic = mongoose.model('Topic', TopicSchema);

module.exports = Topic;
