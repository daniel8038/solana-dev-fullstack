use anchor_lang::prelude::*;

declare_id!("F7U4YUKEyaojCzban2a9q2VUaAeT6q2cWYSCfHcWQJAS");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod favorites {
    use super::*;
    pub fn set_favorites(
        context: Context<SetFavorites>,
        number: u64,
        color: String,
        hobbies: Vec<String>,
    ) -> Result<()> {
        // let singer = context.accounts.singer.key();
        context.accounts.favorites.set_inner(Favorites {
            number,
            color,
            hobbies,
        });
        Ok(())
    }
}   

#[account]
#[derive(InitSpace)]
pub struct Favorites {
    pub number: u64,
    #[max_len(50)]
    pub color: String,
    #[max_len(5, 50)]
    pub hobbies: Vec<String>,
}

#[derive(Accounts)]
pub struct SetFavorites<'info> {
    #[account(mut)]
    pub singer: Signer<'info>,
    #[account(init_if_needed,payer = singer,space = ANCHOR_DISCRIMINATOR_SIZE + Favorites::INIT_SPACE,seeds=[b"favorites",singer.key().as_ref()],bump)]
    pub favorites: Account<'info, Favorites>,

    pub system_program: Program<'info, System>,
}
