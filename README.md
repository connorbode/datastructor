# The Datastructor

## Running

.. to be filled out

## Adding a New Data Structure

1. Create a new editor component in `app/public/components/editors`.
2. Open `app/public/constants/StructureConstants`.
3. Under the `types` key, create a new constant for the editor.
4. Under the `editors` key, add a new entry where the key is the value from step 3, and the value is the name of the file created in step 1.  __Example:__ If I created `app/public/components/editors/SinglyLinkedListEditor.js` in step 1, then an appropriate `StructureConstants` file would be:

    ```
    {
      types: {
        'SINGLY_LINKED_LIST': 'this_value_is_displayed_to_the_user'
      },
      editors: {
        'this_value_is_displayed_to_the_user': 'SinglyLinkedListEditor'
      }
    }
    ```
