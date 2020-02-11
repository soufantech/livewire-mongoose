const { DuplicatedOutboxMessageError, NoOutboxMessageError } = require('livewire');
const { isDuplicatedDocumentMongoError, encode, decode } = require('./helpers');
const MessageOutbox = require('./models/MessageOutbox');

module.exports = () => {

  /**
   * Implements `livewire.OutboxStorageAdapter` interface.
   */
  const getUncleared = () => {
    return MessageOutbox.find({ clearedAt: null })
      .lean()
      .exec()
      .then(messages => messages.map(m => decode(m)));
  };

  /**
   * Implements `livewire.OutboxStorageAdapter` interface.
   */
  const save = async (messages, { session }) => {
    const _messages = messages.map(m => encode(m));

    try {
      await MessageOutbox.create(_messages, { session });
    } catch (err) {

      if (isDuplicatedDocumentMongoError(err)) {
        throw new DuplicatedOutboxMessageError({
          messages: messages,
          originalError: err,
        });
      }

      throw err;
    }
  }

  /**
   * Implements `livewire.OutboxStorageAdapter` interface.
   */
  const watch = (onError, onData) => {
    return MessageOutbox.watch()
      .on('error', onError)
      .on('change', data => {
        if (data.operationType === 'insert') {
          onData(decode(data.fullDocument));
        }
      });
  };

  /**
   * Implements `livewire.OutboxStorageAdapter` interface.
   */
  const clear = async messageId => {
    const message = await MessageOutbox.findOneAndUpdate({
      messageId,
      clearedAt: null,
    }, { clearedAt: Date.now() });

    if (!message) {
      throw new NoOutboxMessageError({ messageId });
    }
  };

  return {
    save,
    clear,
    watch,
    getUncleared,
  };
};
