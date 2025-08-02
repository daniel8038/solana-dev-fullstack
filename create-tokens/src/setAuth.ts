/*
const setMintAuthorityIx = getSetAuthorityInstruction({
  owned: mint,
  owner: MINT_AUTHORITY,
  authorityType: AuthorityType.MintTokens,
  newAuthority: NEW_AUTHORITY.address,
});

// 2. Change Freeze Authority
const setFreezeAuthorityIx = getSetAuthorityInstruction({
  owned: mint,
  owner: MINT_AUTHORITY,
  authorityType: AuthorityType.FreezeAccount,
  newAuthority: NEW_AUTHORITY.address,
});

// Example of revoking authority (setting to null)
const revokeMintAuthorityIx = getSetAuthorityInstruction({
  owned: mint,
  owner: NEW_AUTHORITY,
  authorityType: AuthorityType.MintTokens,
  newAuthority: null,
});

const instruction = [
  setMintAuthorityIx,
  setFreezeAuthorityIx,
  revokeMintAuthorityIx,
];
*/
