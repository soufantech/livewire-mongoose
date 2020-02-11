const { DuplicatedInboxMessageError } = require('livewire');
const { isDuplicatedDocumentMongoError, encode } = require('./helpers');
const MessageInbox = require('./models/MessageInbox');

module.exports = () => {

  /**
   * Implements `livewire.InboxStorageAdapter` interface.
   */
  const save = async (message, { session }) => {
    const _message = encode(message);

    try {
      await MessageInbox.create([_message], { session });
    } catch (err) {
      
      if (isDuplicatedDocumentMongoError(err)) {
        throw new DuplicatedInboxMessageError({
          message: message,
          originalError: err
        });
      }

      throw err;
    }
  };

  return {
    save,
  };
};
