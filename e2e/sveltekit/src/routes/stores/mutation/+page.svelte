<script lang="ts">
  import { graphql, OptimisticUserQueryStore, GQL_UpdateUser } from '$houdini';
  import { stry } from '@kitql/helper';

  const query: OptimisticUserQueryStore = graphql`
    query OptimisticUserQuery {
      user(id: "1", snapshot: "update-user-mutation") {
        name
      }
    }
  `;

  async function add() {
    await GQL_UpdateUser.mutate(
      { id: '1', name: 'JYC', birthDate: new Date('1986-11-07') },
      {
        optimisticResponse: {
          updateUser: {
            id: 'update-user-mutation:1',
            name: '...optimisticResponse... I could have guessed JYC!'
          }
        }
      }
    );
  }
</script>

<h1>Mutation</h1>

<button id="mutate" on:click={add}>Add User</button>

<div id="result">
  {$query.data?.user.name}
</div>

<div id="store-value">
  {stry($GQL_UpdateUser)}
</div>
