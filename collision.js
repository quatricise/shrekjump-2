function boxCollision(entity1, entity2, entity1_expand = 0, entity2_expand = 0) {

  if(
    entity1.pos.x + entity1.hitbox.x/2 + entity1.offset.x + entity1_expand > entity2.pos.x - entity2.hitbox.x/2 + entity2.offset.x - entity2_expand
    && 
    entity1.pos.x - entity1.hitbox.x/2 + entity1.offset.x - entity1_expand < entity2.pos.x + entity2.hitbox.x/2 + entity2.offset.x + entity2_expand
    && 
    entity1.pos.y + entity1.hitbox.y/2 + entity1.offset.y + entity1_expand > entity2.pos.y - entity2.hitbox.y/2 + entity2.offset.y - entity2_expand
    && 
    entity1.pos.y - entity1.hitbox.y/2 + entity1.offset.y - entity1_expand < entity2.pos.y + entity2.hitbox.y/2 + entity2.offset.y + entity2_expand
  ) {
    return true
  }
  else {
    return false
  }
}