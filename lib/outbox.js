const {
  DuplicatedOutboxMessageError,
  NoOutboxMessageError,
  // eslint-disable-next-line import/no-unresolved
} = require('livewire');
const { isDuplicatedDocumentMongoError } = require('./helpers');
const MessageOutbox = require('./models/MessageOutbox');

module.exports = () => {
  /**
   * Implements `livewire.OutboxStorageAdapter` interface.
   */
  const getUncleared = () => {
    return MessageOutbox.find({ clearedAt: null })
      .lean()
      .exec();
  };

  /**
   * Implements `livewire.OutboxStorageAdapter` interface.
   */
  const save = async (messages, options) => {
    try {
      await MessageOutbox.create(messages, options);
    } catch (err) {
      if (isDuplicatedDocumentMongoError(err)) {
        throw new DuplicatedOutboxMessageError({
          messages,
          originalError: err,
        });
      }

      throw err;
    }
  };

  /**
   * Implements `livewire.OutboxStorageAdapter` interface.
   */
  const watch = (onError, onData) => {
    return MessageOutbox.watch()
      .on('error', onError)
      .on('change', data => {
        if (data.operationType === 'insert') {
          onData(data.fullDocument);
        }
      });
  };

  /**
   * Implements `livewire.OutboxStorageAdapter` interface.
   */
  const clear = async messageId => {
    const message = await MessageOutbox.findOneAndUpdate(
      {
        messageId,
        clearedAt: null,
      },
      { clearedAt: Date.now() }
    );

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
