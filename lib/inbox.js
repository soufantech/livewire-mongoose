// eslint-disable-next-line import/no-unresolved
const { DuplicatedInboxMessageError } = require('livewire');
const { isDuplicatedDocumentMongoError } = require('./helpers');
const MessageInbox = require('./models/MessageInbox');

module.exports = () => {
  /**
   * Implements `livewire.InboxStorageAdapter` interface.
   */
  const save = async (message, options) => {
    try {
      await MessageInbox.create([message.metadata], options);
    } catch (err) {
      if (isDuplicatedDocumentMongoError(err)) {
        throw new DuplicatedInboxMessageError({
          message,
          originalError: err,
        });
      }

      throw err;
    }
  };

  return {
    save,
  };
};
