document.addEventListener('click', async (event) => {
    const type = event.target.dataset.type;
    const id = event.target.dataset.id;

    if (type === 'edit') {
        enableEditMode(id);
    } else if (type === 'save') {
        const input = document.querySelector(`.note-edit-input[data-id="${id}"]`);
        const newTitle = input.value.trim();

        if (newTitle) {
            await edit(id, newTitle);
            updateNoteInView(id, newTitle);
            disableEditMode(id);
        }
    } else if (type === 'cancel') {
        disableEditMode(id);
    } else if (type === 'remove') {
        await remove(id);
        document.querySelector(`.list-group-item [data-id="${id}"]`).closest('li').remove();
    }
});

async function remove(id) {
    await fetch(`/${id}`, {method: 'DELETE'})
}

async function edit(id, title) {
    await fetch(`/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id, title}),
    })
}

function enableEditMode(id) {
    const listItem = document.querySelector(`.list-group-item [data-id="${id}"]`).closest('li');
    listItem.querySelector('.note-title').style.display = 'none';
    listItem.querySelector('.note-owner').style.display = 'none';
    listItem.querySelector('.note-edit-input').style.display = 'block';
    listItem.querySelector('.edit-btn').style.display = 'none';
    listItem.querySelector('.delete-btn').style.display = 'none';
    listItem.querySelector('.save-btn').style.display = 'inline-block';
    listItem.querySelector('.cancel-btn').style.display = 'inline-block';
}

function disableEditMode(id) {
    const listItem = document.querySelector(`.list-group-item [data-id="${id}"]`).closest('li');
    listItem.querySelector('.note-title').style.display = 'block';
    listItem.querySelector('.note-owner').style.display = 'block';
    listItem.querySelector('.note-edit-input').style.display = 'none';
    listItem.querySelector('.edit-btn').style.display = 'inline-block';
    listItem.querySelector('.delete-btn').style.display = 'inline-block';
    listItem.querySelector('.save-btn').style.display = 'none';
    listItem.querySelector('.cancel-btn').style.display = 'none';
}

function updateNoteInView(id, newTitle) {
    const listItem = document.querySelector(`.list-group-item [data-id="${id}"]`).closest('li');
    listItem.querySelector('.note-title').textContent = newTitle;
}

// vovagrigoriev
// s7KTbNt5sPWFa2gs