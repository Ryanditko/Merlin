import React, { useState, useEffect } from 'react';
import { User, TeamMember } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Trash2 } from "lucide-react";

export default function TeamMembers({ team, members, currentUser, onMembersChange }) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [memberDetails, setMemberDetails] = useState({});

  useEffect(() => {
    const fetchMemberDetails = async () => {
      const details = {};
      for (const member of members) {
        // This is a placeholder. In a real app, you might fetch user profiles.
        // For now, we'll just use the email to create a name.
        details[member.user_email] = {
          fullName: member.user_email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          initials: member.user_email.charAt(0).toUpperCase()
        };
      }
      setMemberDetails(details);
    };

    if (members.length > 0) {
      fetchMemberDetails();
    }
  }, [members]);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      await TeamMember.create({
        team_id: team.id,
        user_email: inviteEmail,
        role: 'member'
      });
      setInviteEmail("");
      onMembersChange();
    } catch (error) {
      console.error("Erro ao convidar membro:", error);
      alert("Erro ao convidar membro. Verifique se o e-mail é válido e tente novamente.");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm("Tem certeza que deseja remover este membro?")) {
      await TeamMember.delete(memberId);
      onMembersChange();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Membros da Equipe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Email do novo membro"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <Button onClick={handleInvite}>
              <Plus className="w-4 h-4 mr-2" />
              Convidar
            </Button>
          </div>
          <div className="space-y-2">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{memberDetails[member.user_email]?.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{memberDetails[member.user_email]?.fullName}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
                {member.user_email !== team.created_by && (
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(member.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}